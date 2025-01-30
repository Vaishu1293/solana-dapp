use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("GWXJMUTKETCdfGMYN7dgXAtu3831oaxLNz95u4risCfQ");

#[program]
pub mod gifportal {
    use super::*;

    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        Ok(())
    }
}


#[derive(Accounts)]
pub struct StartStuffOff {}

