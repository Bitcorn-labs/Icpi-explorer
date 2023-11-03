
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {

  public type Timestamp = Nat64;
  public type TxIndex = Nat;
  public type Subaccount = Blob;
  public type Balance = Nat;
  public type Account = {
      owner : Principal;
      subaccount : ?Subaccount;
  };
  public type Transaction = {
    kind : Text;
    mint : ?Mint;
    burn : ?Burn;
    transfer : ?Transfer;
    index : TxIndex;
    timestamp : Timestamp;
  };
  public type Transfer = {
      from : Account;
      to : Account;
      amount : Balance;
      fee : ?Balance;
      memo : ?Blob;
      created_at_time : ?Nat64;
  };
  public type Mint = {
      to : Account;
      amount : Balance;
      memo : ?Blob;
      created_at_time : ?Nat64;
  };
  public type Burn = {
      from : Account;
      amount : Balance;
      memo : ?Blob;
      created_at_time : ?Nat64;
  };
  public type GetTransactionsRequest = {
      start : TxIndex;
      length : Nat;
  };
  public type GetTransactionsResponse = {
      /// The number of valid transactions in the ledger and archived canisters that are in the given range
      log_length : Nat;

      /// the index of the first tx in the `transactions` field
      first_index : TxIndex;

      /// The transactions in the ledger canister that are in the given range
      transactions : [Transaction];

      /// Pagination request for archived transactions in the given range
      archived_transactions : [ArchivedTransaction];
  };
  public type ArchivedTransaction = {
      /// The index of the first transaction to be queried in the archive canister
      start : TxIndex;
      /// The number of transactions to be queried in the archive canister
      length : Nat;

      /// The callback function to query the archive canister
      callback: QueryArchiveFn;
  };  
  public type TransactionRange = {
      transactions: [Transaction];
  };
  public type QueryArchiveFn = shared query (GetTransactionsRequest) -> async TransactionRange;

  let sneed = actor ("r7cp6-6aaaa-aaaag-qco5q-cai") : actor {
      icrc1_balance_of(args : Account) : async Balance;
      get_transaction(i : TxIndex) : async ?Transaction;
      get_transactions(i : GetTransactionsRequest) : async GetTransactionsResponse;
  };  

  let sneed_archive = actor ("2pwqi-6yaaa-aaaag-qcpda-cai") : actor {
      get_transaction(i : TxIndex) : async ?Transaction;
      get_transactions(i : GetTransactionsRequest) : async TransactionRange;
  };  

  public func balance_of(args : Text) : async Balance {
    let act : Account = {
      owner = Principal.fromText(args);
      subaccount = null;
    };
    await sneed.icrc1_balance_of(act);
  };

  public func get_transaction(i : TxIndex) : async ?Transaction {
    await sneed.get_transaction(i);
  };

  public func get_transactions(i : TxIndex, length : Nat) : async TransactionRange {
    let req : GetTransactionsRequest = {
      start = i;
      length = length;
    };
    await sneed_archive.get_transactions(req);
  };

//  public query func greet(name : Text) : async Text {
//    return "Hello, " # name # "!";
//  };
};
