
import Principal "mo:base/Principal";
import Text "mo:base/Text";

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

  let sneed = actor ("r7cp6-6aaaa-aaaag-qco5q-cai") : actor {
      icrc1_balance_of(args : Account) : async Balance;
      get_transaction(i : TxIndex) : async ?Transaction;
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

//  public query func greet(name : Text) : async Text {
//    return "Hello, " # name # "!";
//  };
};
