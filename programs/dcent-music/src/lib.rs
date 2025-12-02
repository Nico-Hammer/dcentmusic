use anchor_lang::prelude::*;

declare_id!("FoifQqF6jRL6nzfkF7EpWsjTEdfA4cHx7ikb5zraMq1V");

#[program]
pub mod dcent_music {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64, input: String) -> Result<()> {
        ctx.accounts.new_account.data = data;
        ctx.accounts.new_account.input = input;
        msg!("Greetings from: {:?}\nValue of input: {:?}\nValue of data: {}", ctx.program_id,ctx.accounts.new_account.input,ctx.accounts.new_account.data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8 + 4 + 100)]

    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]

    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[account]
pub struct NewAccount {
    pub data: u64,
    pub input: String,
}