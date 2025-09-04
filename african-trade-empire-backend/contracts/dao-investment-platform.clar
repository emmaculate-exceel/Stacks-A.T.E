;; DAO Investment Platform - Extends African Trade Empire
;; Transforms existing NFT game into real-world investment platform

;; Traits
(define-trait sip-009-trait
  (
    ;; Last token ID, limited to uint range
    (get-last-token-id () (response uint uint))

    ;; URI for metadata associated with the token
    (get-token-uri (uint) (response (optional (string-utf8 256)) uint))

    ;; Owner of a given token identifier
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal) (response bool uint))
  )
)

(define-trait sip-010-trait
  (
    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; the human readable name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; the ticker symbol, or empty if none
    (get-symbol () (response (string-ascii 32) uint))

    ;; the number of decimals used, e.g. 6 would mean 1_000_000 represents 1 token
    (get-decimals () (response uint uint))

    ;; the balance of the passed principal
    (get-balance (principal) (response uint uint))

    ;; the current total supply (which does not need to be a constant)
    (get-total-supply () (response uint uint))

    ;; an optional URI that represents metadata of this token
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-insufficient-funds (err u102))
(define-constant err-invalid-investment (err u103))
(define-constant err-pool-not-found (err u104))
(define-constant err-proposal-not-found (err u105))
(define-constant err-already-voted (err u106))
(define-constant err-voting-closed (err u107))
(define-constant err-min-threshold (err u108))

;; Platform configuration
(define-constant min-proposal-threshold u1000) ;; Minimum tokens to create proposal
(define-constant voting-period u1440) ;; 24 hours in blocks (assuming 1 min blocks)
(define-constant min-participation u20) ;; 20% minimum participation
(define-constant max-investors u100) ;; Maximum investors per pool

;; Data variables
(define-data-var last-pool-id uint u0)
(define-data-var last-proposal-id uint u0)
(define-data-var platform-fee-rate uint u200) ;; 2% platform fee (200 basis points)
(define-data-var total-platform-revenue uint u0)

;; NFT data for investment certificates
(define-data-var last-investment-cert-id uint u0)

;; Fungible token for governance (TET - Trade Empire Token)
(define-fungible-token trade-empire-token)
(define-data-var token-total-supply uint u0)

;; Investment pools map
(define-map investment-pools
  { pool-id: uint }
  {
    name: (string-ascii 100),
    description: (string-ascii 500),
    target-amount: uint,
    raised-amount: uint,
    minimum-investment: uint,
    expected-return: uint, ;; percentage * 100 (e.g., 1200 = 12%)
    investment-period: uint, ;; in blocks
    status: (string-ascii 20), ;; "funding", "active", "completed", "failed"
    created-by: principal,
    created-at: uint,
    completion-deadline: uint,
    investors-count: uint,
    profit-distributed: bool,
    final-amount: uint ;; Final amount after investment completion
  }
)

;; Investment positions for users
(define-map user-investments
  { user: principal, pool-id: uint }
  {
    amount-invested: uint,
    investment-date: uint,
    profit-claimed: bool,
    voting-power: uint,
    certificate-nft-id: uint
  }
)

;; Track all investors for a pool
(define-map pool-investors
  { pool-id: uint, investor-index: uint }
  { investor: principal }
)

;; Governance proposals
(define-map governance-proposals
  { proposal-id: uint }
  {
    title: (string-ascii 100),
    description: (string-ascii 500),
    proposal-type: (string-ascii 50), ;; "investment", "fee-change", "platform-upgrade"
    proposed-by: principal,
    votes-for: uint,
    votes-against: uint,
    total-voting-power: uint,
    voting-deadline: uint,
    executed: bool,
    pool-id: (optional uint), ;; For investment proposals
    min-participation: uint
  }
)

;; Track user votes to prevent double voting
(define-map user-votes
  { proposal-id: uint, user: principal }
  { voted: bool, vote-for: bool, voting-power: uint }
)

;; Investment certificates as NFTs
(define-map investment-certificates
  { cert-id: uint }
  {
    pool-id: uint,
    investor: principal,
    amount: uint,
    issue-date: uint,
    metadata-uri: (optional (string-utf8 256))
  }
)

;; === SIP-010 FUNGIBLE TOKEN IMPLEMENTATION ===

(define-read-only (get-name)
  (ok "Trade Empire Token")
)

(define-read-only (get-symbol)
  (ok "TET")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance trade-empire-token account))
)

(define-read-only (get-total-supply)
  (ok (var-get token-total-supply))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-authorized)
    (try! (ft-transfer? trade-empire-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; === SIP-009 NFT IMPLEMENTATION (Investment Certificates) ===

(define-read-only (get-last-token-id)
  (ok (var-get last-investment-cert-id))
)

(define-read-only (get-token-uri (cert-id uint))
  (match (map-get? investment-certificates {cert-id: cert-id})
    cert (ok (get metadata-uri cert))
    (err err-pool-not-found)
  )
)

(define-read-only (get-owner (cert-id uint))
  (match (map-get? investment-certificates {cert-id: cert-id})
    cert (ok (get investor cert))
    (err err-pool-not-found)
  )
)

(define-public (transfer-nft (cert-id uint) (sender principal) (recipient principal))
  (let
    (
      (cert (unwrap! (map-get? investment-certificates {cert-id: cert-id}) err-pool-not-found))
    )
    (asserts! (is-eq sender tx-sender) err-not-authorized)
    (asserts! (is-eq (get investor cert) sender) err-not-authorized)
    
    ;; Update certificate ownership
    (map-set investment-certificates
      { cert-id: cert-id }
      (merge cert { investor: recipient })
    )
    
    ;; Update investment record
    (map-set user-investments
      { user: recipient, pool-id: (get pool-id cert) }
      {
        amount-invested: (get amount cert),
        investment-date: (get issue-date cert),
        profit-claimed: false,
        voting-power: (get amount cert),
        certificate-nft-id: cert-id
      }
    )
    
    ;; Remove from sender
    (map-delete user-investments { user: sender, pool-id: (get pool-id cert) })
    
    (ok true)
  )
)

;; === CORE DAO INVESTMENT FUNCTIONS ===

;; Mint initial tokens for platform bootstrapping
(define-public (mint-tokens (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? trade-empire-token amount recipient))
    (var-set token-total-supply (+ (var-get token-total-supply) amount))
    (ok true)
  )
)

;; Create investment pool (anyone with minimum tokens can propose)
(define-public (create-investment-pool
  (name (string-ascii 100))
  (description (string-ascii 500))
  (target-amount uint)
  (minimum-investment uint)
  (expected-return uint)
  (investment-period uint)
)
  (let
    (
      (pool-id (+ (var-get last-pool-id) u1))
      (user-tokens (ft-get-balance trade-empire-token tx-sender))
      (completion-deadline (+ burn-block-height investment-period))
    )
    ;; Check if user has minimum tokens to create pools
    (asserts! (>= user-tokens min-proposal-threshold) err-min-threshold)
    (asserts! (> target-amount u0) err-invalid-investment)
    (asserts! (> minimum-investment u0) err-invalid-investment)
    
    ;; Create the investment pool
    (map-set investment-pools
      { pool-id: pool-id }
      {
        name: name,
        description: description,
        target-amount: target-amount,
        raised-amount: u0,
        minimum-investment: minimum-investment,
        expected-return: expected-return,
        investment-period: investment-period,
        status: "funding",
        created-by: tx-sender,
        created-at: burn-block-height,
        completion-deadline: completion-deadline,
        investors-count: u0,
        profit-distributed: false,
        final-amount: u0
      }
    )
    
    (var-set last-pool-id pool-id)
    (print { event: "pool-created", pool-id: pool-id, creator: tx-sender })
    (ok pool-id)
  )
)

;; Invest in a pool
(define-public (invest-in-pool (pool-id uint) (amount uint))
  (let
    (
      (pool (unwrap! (map-get? investment-pools {pool-id: pool-id}) err-pool-not-found))
      (current-raised (get raised-amount pool))
      (target (get target-amount pool))
      (cert-id (+ (var-get last-investment-cert-id) u1))
      (current-investors (get investors-count pool))
    )
    ;; Verify pool is accepting investments
    (asserts! (is-eq (get status pool) "funding") err-invalid-investment)
    (asserts! (>= amount (get minimum-investment pool)) err-invalid-investment)
    (asserts! (<= (+ current-raised amount) target) err-invalid-investment)
    (asserts! (< current-investors max-investors) err-invalid-investment)
    (asserts! (< burn-block-height (get completion-deadline pool)) err-invalid-investment)
    
    ;; Transfer tokens to contract
    (try! (ft-transfer? trade-empire-token amount tx-sender (as-contract tx-sender)))
    
    ;; Mint investment certificate NFT
    (map-set investment-certificates
      { cert-id: cert-id }
      {
        pool-id: pool-id,
        investor: tx-sender,
        amount: amount,
        issue-date: burn-block-height,
        metadata-uri: none
      }
    )
    
    ;; Update pool
    (map-set investment-pools
      { pool-id: pool-id }
      (merge pool {
        raised-amount: (+ current-raised amount),
        investors-count: (+ current-investors u1)
      })
    )
    
    ;; Add investor to pool investors list
    (map-set pool-investors
      { pool-id: pool-id, investor-index: current-investors }
      { investor: tx-sender }
    )
    
    ;; Record user investment
    (map-set user-investments
      { user: tx-sender, pool-id: pool-id }
      {
        amount-invested: amount,
        investment-date: burn-block-height,
        profit-claimed: false,
        voting-power: amount, ;; 1 token = 1 vote
        certificate-nft-id: cert-id
      }
    )
    
    (var-set last-investment-cert-id cert-id)
    
    ;; If target reached, activate pool
    (if (>= (+ current-raised amount) target)
      (begin
        (map-set investment-pools
          { pool-id: pool-id }
          (merge pool { status: "active" })
        )
        (print { event: "pool-funded", pool-id: pool-id, total-raised: (+ current-raised amount) })
        true
      )
      (begin
        (print { event: "investment-made", pool-id: pool-id, investor: tx-sender, amount: amount })
        true
      )
    )
    
    (ok cert-id)
  )
)

;; Create governance proposal
(define-public (create-proposal
  (title (string-ascii 100))
  (description (string-ascii 500))
  (proposal-type (string-ascii 50))
  (pool-id (optional uint))
)
  (let
    (
      (proposal-id (+ (var-get last-proposal-id) u1))
      (user-voting-power (ft-get-balance trade-empire-token tx-sender))
      (voting-deadline (+ burn-block-height voting-period))
    )
    ;; Check minimum voting power to create proposal
    (asserts! (>= user-voting-power min-proposal-threshold) err-min-threshold)
    
    (map-set governance-proposals
      { proposal-id: proposal-id }
      {
        title: title,
        description: description,
        proposal-type: proposal-type,
        proposed-by: tx-sender,
        votes-for: u0,
        votes-against: u0,
        total-voting-power: u0,
        voting-deadline: voting-deadline,
        executed: false,
        pool-id: pool-id,
        min-participation: min-participation
      }
    )
    
    (var-set last-proposal-id proposal-id)
    (print { event: "proposal-created", proposal-id: proposal-id, proposer: tx-sender })
    (ok proposal-id)
  )
)

;; Vote on proposal
(define-public (vote-on-proposal (proposal-id uint) (vote-for bool))
  (let
    (
      (proposal (unwrap! (map-get? governance-proposals {proposal-id: proposal-id}) err-proposal-not-found))
      (user-power (ft-get-balance trade-empire-token tx-sender))
      (existing-vote (map-get? user-votes {proposal-id: proposal-id, user: tx-sender}))
    )
    ;; Check voting is still open and user hasn't voted
    (asserts! (< burn-block-height (get voting-deadline proposal)) err-voting-closed)
    (asserts! (> user-power u0) err-insufficient-funds)
    (asserts! (is-none existing-vote) err-already-voted)
    
    ;; Record user vote
    (map-set user-votes
      { proposal-id: proposal-id, user: tx-sender }
      { voted: true, vote-for: vote-for, voting-power: user-power }
    )
    
    ;; Update proposal votes
    (map-set governance-proposals
      { proposal-id: proposal-id }
      (merge proposal {
        votes-for: (if vote-for (+ (get votes-for proposal) user-power) (get votes-for proposal)),
        votes-against: (if vote-for (get votes-against proposal) (+ (get votes-against proposal) user-power)),
        total-voting-power: (+ (get total-voting-power proposal) user-power)
      })
    )
    
    (print { event: "vote-cast", proposal-id: proposal-id, voter: tx-sender, vote-for: vote-for, power: user-power })
    (ok true)
  )
)

;; Complete investment and distribute profits (only pool creator or owner)
(define-public (complete-investment (pool-id uint) (final-amount uint))
  (let
    (
      (pool (unwrap! (map-get? investment-pools {pool-id: pool-id}) err-pool-not-found))
      (platform-fee (/ (* final-amount (var-get platform-fee-rate)) u10000))
      (net-amount (- final-amount platform-fee))
    )
    ;; Only pool creator or contract owner can complete
    (asserts! (or (is-eq tx-sender (get created-by pool)) (is-eq tx-sender contract-owner)) err-not-authorized)
    (asserts! (is-eq (get status pool) "active") err-invalid-investment)
    (asserts! (> final-amount (get raised-amount pool)) err-invalid-investment) ;; Must be profitable
    
    ;; Update platform revenue
    (var-set total-platform-revenue (+ (var-get total-platform-revenue) platform-fee))
    
    ;; Mark as completed
    (map-set investment-pools
      { pool-id: pool-id }
      (merge pool { 
        status: "completed",
        final-amount: net-amount
      })
    )
    
    (print { event: "investment-completed", pool-id: pool-id, final-amount: net-amount, platform-fee: platform-fee })
    (ok true)
  )
)

;; Claim profits from completed investment
(define-public (claim-profits (pool-id uint))
  (let
    (
      (pool (unwrap! (map-get? investment-pools {pool-id: pool-id}) err-pool-not-found))
      (user-investment (unwrap! (map-get? user-investments {user: tx-sender, pool-id: pool-id}) err-pool-not-found))
      (total-raised (get raised-amount pool))
      (final-amount (get final-amount pool))
      (user-share (/ (* (get amount-invested user-investment) u10000) total-raised))
      (profit-amount (/ (* final-amount user-share) u10000))
    )
    ;; Verify pool is completed and user hasn't claimed
    (asserts! (is-eq (get status pool) "completed") err-invalid-investment)
    (asserts! (not (get profit-claimed user-investment)) err-invalid-investment)
    (asserts! (> final-amount u0) err-invalid-investment)
    
    ;; Transfer profits to user
    (try! (as-contract (ft-transfer? trade-empire-token profit-amount (as-contract tx-sender) tx-sender)))
    
    ;; Mark as claimed
    (map-set user-investments
      { user: tx-sender, pool-id: pool-id }
      (merge user-investment { profit-claimed: true })
    )
    
    (print { event: "profits-claimed", pool-id: pool-id, user: tx-sender, amount: profit-amount })
    (ok profit-amount)
  )
)

;; === HELPER FUNCTIONS ===

(define-private (get-user-total-voting-power (user principal))
  (ft-get-balance trade-empire-token user)
)

;; === READ-ONLY FUNCTIONS ===

(define-read-only (get-investment-pool (pool-id uint))
  (map-get? investment-pools {pool-id: pool-id})
)

(define-read-only (get-user-investment (user principal) (pool-id uint))
  (map-get? user-investments {user: user, pool-id: pool-id})
)

(define-read-only (get-proposal (proposal-id uint))
  (map-get? governance-proposals {proposal-id: proposal-id})
)

(define-read-only (get-platform-fee-rate)
  (var-get platform-fee-rate)
)

(define-read-only (get-platform-revenue)
  (var-get total-platform-revenue)
)

(define-read-only (get-pool-investor (pool-id uint) (investor-index uint))
  (map-get? pool-investors {pool-id: pool-id, investor-index: investor-index})
)

(define-read-only (get-user-vote (proposal-id uint) (user principal))
  (map-get? user-votes {proposal-id: proposal-id, user: user})
)

(define-read-only (get-investment-certificate (cert-id uint))
  (map-get? investment-certificates {cert-id: cert-id})
)

(define-read-only (calculate-user-profit (user principal) (pool-id uint))
  (match (map-get? investment-pools {pool-id: pool-id})
    pool (match (map-get? user-investments {user: user, pool-id: pool-id})
      user-investment 
      (let
        (
          (total-raised (get raised-amount pool))
          (final-amount (get final-amount pool))
          (user-share (/ (* (get amount-invested user-investment) u10000) total-raised))
          (profit-amount (/ (* final-amount user-share) u10000))
        )
        (if (is-eq (get status pool) "completed")
          (ok profit-amount)
          (ok u0)
        )
      )
      (err err-pool-not-found)
    )
    (err err-pool-not-found)
  )
)

;; === ADMINISTRATIVE FUNCTIONS ===

(define-public (update-platform-fee (new-fee-rate uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-fee-rate u1000) err-invalid-investment) ;; Max 10% fee
    (var-set platform-fee-rate new-fee-rate)
    (print { event: "platform-fee-updated", new-rate: new-fee-rate })
    (ok true)
  )
)

(define-public (withdraw-platform-revenue (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= amount (var-get total-platform-revenue)) err-insufficient-funds)
    
    (try! (as-contract (ft-transfer? trade-empire-token amount (as-contract tx-sender) recipient)))
    (var-set total-platform-revenue (- (var-get total-platform-revenue) amount))
    
    (print { event: "revenue-withdrawn", amount: amount, recipient: recipient })
    (ok true)
  )
)
