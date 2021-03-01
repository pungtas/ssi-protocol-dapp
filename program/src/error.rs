//! Error types

use num_derive::FromPrimitive;
use num_traits::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    program_error::{
        PrintProgramError,
        ProgramError,
    },
    msg
};
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum ProtocolError {
    /// Lamport balance below rent-exempt threshold.
    #[error("Lamport balance below rent-exempt threshold")]
    NotRentExempt,
    /// Insufficient funds for the operation requested.
    #[error("Insufficient funds")]
    InsufficientFunds,
    /// Invalid Mint.
    #[error("Invalid Mint")]
    InvalidMint,
    /// Account not associated with this Mint.
    #[error("Account not associated with this Mint")]
    MintMismatch,
    /// Owner does not match.
    #[error("Owner does not match")]
    OwnerMismatch,
    /// This token's supply is fixed and new tokens cannot be minted.
    #[error("Fixed supply")]
    FixedSupply,
    /// The account cannot be initialized because it is already being used.
    #[error("Already in use")]
    AlreadyInUse,
    /// Invalid number of provided signers.
    #[error("Invalid number of provided signers")]
    InvalidNumberOfProvidedSigners,
    /// Invalid number of required signers.
    #[error("Invalid number of required signers")]
    InvalidNumberOfRequiredSigners,
    /// State is uninitialized.
    #[error("State is unititialized")]
    UninitializedState,
    /// Instruction does not support native tokens
    #[error("Instruction does not support native tokens")]
    NativeNotSupported,
    /// Non-native account can only be closed if its balance is zero
    #[error("Non-native account can only be closed if its balance is zero")]
    NonNativeHasBalance,
    /// Invalid instruction
    #[error("Invalid instruction")]
    InvalidInstruction,
    /// State is invalid for requested operation.
    #[error("State is invalid for requested operation")]
    InvalidState,
    /// Operation overflowed
    #[error("Operation overflowed")]
    Overflow,
    /// Account does not support specified authority type.
    #[error("Account does not support specified authority type")]
    AuthorityTypeNotSupported,
    /// This token mint cannot freeze accounts.
    #[error("This token mint cannot freeze accounts")]
    MintCannotFreeze,
    /// Account is frozen; all account operations will fail
    #[error("Account is frozen")]
    AccountFrozen,
    /// Mint decimals mismatch between the client and mint
    #[error("The provided decimals value different from the Mint decimals")]
    MintDecimalsMismatch,
    /// Message instruction is too large
    #[error("Instruction size too large")]
    MessageTooLarge,
    /// Message instruction is too small
    #[error("Instruction size too small")]
    MessageTooSmall,
    /// Message size is greater than max
    #[error("Message length too large for instruction")]
    MessageLengthTooLarge,
    /// Message size is too small (nonzero data contained after length ends)
    #[error("Message length too small")]
    MessageLengthTooSmall,
    /// Message contains no data
    #[error("Message is empty")]
    MessageEmpty,
    /// Message queue buffer invalid size
    #[error("Message queue account is the wrong size")]
    MessageQueueAccountWrongSize,
    /// Message queue head invalid
    #[error("Message queue head is invalid")]
    MessageQueueBad,
    /// Signer and queue accounts not passed
    #[error("Invocation expects [signer, queue] accounts to get passed")]
    NoAccountsPassed,
    /// Queue account not passed
    #[error("Queue account not passed")]
    QueueNotPassed,
    /// Extra accounts passed
    #[error("Extra accounts passed")]
    ExtraAccountsPassed,
    /// Sender did not sign
    #[error("Sender must have signed the transaction")]
    SenderDidNotSign,
}
impl From<ProtocolError> for ProgramError {
    fn from(e: ProtocolError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for ProtocolError {
    fn type_of() -> &'static str {
        "ProtocolError"
    }
}


impl PrintProgramError for ProtocolError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            ProtocolError::NotRentExempt => msg!("Error: Lamport balance below rent-exempt threshold"),
            ProtocolError::InsufficientFunds => msg!("Error: insufficient funds"),
            ProtocolError::InvalidMint => msg!("Error: Invalid Mint"),
            ProtocolError::MintMismatch => msg!("Error: Account not associated with this Mint"),
            ProtocolError::OwnerMismatch => msg!("Error: owner does not match"),
            ProtocolError::FixedSupply => msg!("Error: the total supply of this token is fixed"),
            ProtocolError::AlreadyInUse => msg!("Error: account or token already in use"),
            ProtocolError::InvalidNumberOfProvidedSigners => msg!("Error: Invalid number of provided signers"),
            ProtocolError::InvalidNumberOfRequiredSigners => msg!("Error: Invalid number of required signers"),
            ProtocolError::UninitializedState => msg!("Error: State is uninitialized"),
            ProtocolError::NativeNotSupported => msg!("Error: Instruction does not support native tokens"),
            ProtocolError::NonNativeHasBalance => msg!("Error: Non-native account can only be closed if its balance is zero"),
            ProtocolError::InvalidInstruction => msg!("Error: Invalid instruction"),
            ProtocolError::InvalidState => msg!("Error: Invalid account state for operation"),
            ProtocolError::Overflow => msg!("Error: Operation overflowed"),
            ProtocolError::AuthorityTypeNotSupported => msg!("Error: Account does not support specified authority type"),
            ProtocolError::MintCannotFreeze => msg!("Error: This token mint cannot freeze accounts"),
            ProtocolError::AccountFrozen => msg!("Error: Account is frozen"),
            ProtocolError::MintDecimalsMismatch => msg!("Error: decimals different from the Mint decimals"),
            ProtocolError::MessageTooLarge => msg!("Instruction size too large"),
            ProtocolError::MessageTooSmall => msg!("Instruction size too small"),
            ProtocolError::MessageLengthTooLarge => msg!("Message length too large for instruction"),
            ProtocolError::MessageLengthTooSmall => msg!("Message length too small"),
            ProtocolError::MessageEmpty => msg!("Message is empty"),
            ProtocolError::MessageQueueAccountWrongSize => msg!("Message queue account is the wrong size"),
            ProtocolError::MessageQueueBad => msg!("Message queue head is invalid"),
            ProtocolError::NoAccountsPassed => msg!("Invocation expects [signer, queue] accounts to get passed"),
            ProtocolError::QueueNotPassed => msg!("Queue account not passed"),
            ProtocolError::ExtraAccountsPassed => msg!("Extra accounts passed"),
            ProtocolError::SenderDidNotSign => msg!("Sender must sign the transaction"),
        }
    }
}
