//! Program entrypoint

#![cfg(feature = "program")]
#![cfg(not(feature = "no-entrypoint"))]

use crate::{
    error::ProtocolError,
    processor::Processor,
};

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::PrintProgramError
};

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    if let Err(error) = Processor::process(program_id, accounts, instruction_data) {
        error.print::<ProtocolError>();
        return Err(error);
    }
    Ok(())
}
