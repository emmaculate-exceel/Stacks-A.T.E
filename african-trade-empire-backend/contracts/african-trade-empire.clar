;; African Trade Empire - Main Contract
;; A simplified NFT trading card game on Stacks blockchain

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-listing-not-active (err u102))
(define-constant err-insufficient-balance (err u103))
(define-constant err-card-not-found (err u104))
(define-constant err-listing-not-found (err u105))

;; Data maps
;; Card storage - for both Merchant and Resource cards
(define-map cards
  { card-id: uint }
  {
    owner: principal,
    card-type: (string-ascii 20), ;; "merchant" or "resource"
    subtype: (string-ascii 20),  ;; e.g. "caravan-leader", "gold", etc.
    rarity: uint,  ;; 1=common, 2=uncommon, 3=rare
    trade-power: uint,
    region: (string-ascii 30),
    uri: (optional (string-utf8 256))
  }
)

;; Marketplace listings
(define-map listings
  { listing-id: uint }
  {
    seller: principal,
    card-id: uint,
    price: uint,
    status: uint  ;; 1=active, 2=sold, 3=canceled
  }
)

;; Fungible token for in-game currency (SIP-010 compliant)
(define-fungible-token trade-token)

;; Variables
(define-data-var last-card-id uint u0)
(define-data-var last-listing-id uint u0)
(define-data-var total-supply uint u0)

;; SIP-009 NFT Trait Conformance
;; Required SIP-009 NFT functions
(define-read-only (get-last-token-id)
  (ok (var-get last-card-id))
)

(define-read-only (get-token-uri (id uint))
  (match (map-get? cards {card-id: id})
    card (ok (get uri card))
    (err err-card-not-found)
  )
)

(define-read-only (get-owner (id uint))
  (match (map-get? cards {card-id: id})
    card (ok (get owner card))
    (err err-card-not-found)
  )
)

;; SIP-010 Fungible Token Functions
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
  (ok (ft-get-balance trade-token account))
)

(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (ft-transfer? trade-token amount sender recipient)
  )
)

;; Card Management Functions
(define-public (mint-card 
  (recipient principal) 
  (card-type (string-ascii 20)) 
  (subtype (string-ascii 20))
  (rarity uint)
  (trade-power uint)
  (region (string-ascii 30))
  (uri (optional (string-utf8 256)))
)
  (let 
    (
      (new-card-id (+ (var-get last-card-id) u1))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set cards
      { card-id: new-card-id }
      {
        owner: recipient,
        card-type: card-type,
        subtype: subtype,
        rarity: rarity,
        trade-power: trade-power,
        region: region,
        uri: uri
      }
    )
    (var-set last-card-id new-card-id)
    (ok new-card-id)
  )
)

(define-public (transfer-card (id uint) (sender principal) (recipient principal))
  (let
    (
      (card (unwrap! (map-get? cards {card-id: id}) err-card-not-found))
    )
    ;; Check ownership
    (asserts! (is-eq sender tx-sender) err-not-token-owner)
    (asserts! (is-eq (get owner card) sender) err-not-token-owner)
    
    ;; Update ownership
    (map-set cards
      { card-id: id }
      (merge card { owner: recipient })
    )
    
    ;; Return success
    (ok true)
  )
)

;; Card Pack Functions
(define-public (mint-card-pack (recipient principal) (pack-type uint) (price uint))
  (let
    (
      (sender tx-sender)
    )
    ;; Only contract owner can mint packs
    (asserts! (is-eq sender contract-owner) err-owner-only)
    
    ;; Simple implementation - return success
    ;; In a full implementation, this would create card pack NFTs
    (ok true)
  )
)

(define-public (open-card-pack (pack-id uint))
  (let
    (
      (owner tx-sender)
      ;; Simple implementation - predefined cards to mint
      ;; In a full implementation, this would use randomization
      (card1-type "merchant")
      (card1-subtype "caravan-leader")
      (card1-rarity u1)
      (card1-power u5)
      (card1-region "North Africa")
    )
    ;; In a full implementation, verify pack ownership
    ;; For simplicity, we're just minting new cards
    (unwrap! (mint-card owner card1-type card1-subtype card1-rarity card1-power card1-region none) err-owner-only)
    (ok true)
  )
)

;; Marketplace Functions
(define-public (list-card (card-id uint) (price uint))
  (let
    (
      (seller tx-sender)
      (card (unwrap! (map-get? cards {card-id: card-id}) err-card-not-found))
      (listing-id (+ (var-get last-listing-id) u1))
    )
    ;; Verify card ownership
    (asserts! (is-eq (get owner card) seller) err-not-token-owner)
    
    ;; Create listing
    (map-set listings
      { listing-id: listing-id }
      {
        seller: seller,
        card-id: card-id,
        price: price,
        status: u1 ;; Active
      }
    )
    
    ;; Update listing ID counter
    (var-set last-listing-id listing-id)
    
    (ok listing-id)
  )
)

(define-public (buy-card (listing-id uint))
  (let
    (
      (buyer tx-sender)
      (listing (unwrap! (map-get? listings {listing-id: listing-id}) err-listing-not-found))
      (card-id (get card-id listing))
      (price (get price listing))
      (seller (get seller listing))
    )
    ;; Verify listing is active
    (asserts! (is-eq (get status listing) u1) err-listing-not-active)
    
    ;; Process payment
    (try! (ft-transfer? trade-token price buyer seller))
    
    ;; Transfer card to buyer
    (try! (transfer-card card-id seller buyer))
    
    ;; Update listing status
    (map-set listings
      { listing-id: listing-id }
      (merge listing { status: u2 }) ;; Sold
    )
    
    (ok true)
  )
)

(define-public (cancel-listing (listing-id uint))
  (let
    (
      (seller tx-sender)
      (listing (unwrap! (map-get? listings {listing-id: listing-id}) err-listing-not-found))
    )
    ;; Verify seller is the one who created the listing
    (asserts! (is-eq (get seller listing) seller) err-not-token-owner)
    ;; Verify listing is active
    (asserts! (is-eq (get status listing) u1) err-listing-not-active)
    
    ;; Update listing status
    (map-set listings
      { listing-id: listing-id }
      (merge listing { status: u3 }) ;; Canceled
    )
    
    (ok true)
  )
)

;; Game Mechanics
(define-map trade-routes
  { route-id: uint }
  {
    owner: principal,
    start-region: (string-ascii 30),
    end-region: (string-ascii 30),
    merchant-id: uint,
    resource-id: uint,
    trade-value: uint
  }
)

(define-data-var last-route-id uint u0)


;; Token Minting for Admin
(define-public (mint-tokens (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? trade-token amount recipient)
  )
)
