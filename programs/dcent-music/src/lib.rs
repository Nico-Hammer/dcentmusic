use anchor_lang::prelude::*;

declare_id!("C5Ye9rDrtnkFiutddobjYNR9xeTuNC9ALAttX29wUMRw");

#[program]
pub mod dcent_music {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
