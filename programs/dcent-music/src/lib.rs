use anchor_lang::prelude::*;

declare_id!("FoifQqF6jRL6nzfkF7EpWsjTEdfA4cHx7ikb5zraMq1V");

#[program]
pub mod dcent_music {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let mut x = 0;
        for n in 1..10{
            if n == 10{
                break;
            }
            x += n;
        }
        ctx.accounts.new_account.data = data;
        msg!("Greetings from: {:?}\nValue of x: {:?}\nValue of data: {}", ctx.program_id,x,ctx.accounts.new_account.data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]

    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]

    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[account]
pub struct NewAccount {
    data: u64,
}