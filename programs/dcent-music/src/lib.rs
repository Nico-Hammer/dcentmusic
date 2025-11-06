use anchor_lang::prelude::*;

declare_id!("FoifQqF6jRL6nzfkF7EpWsjTEdfA4cHx7ikb5zraMq1V");

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