use anchor_lang::prelude::*;

declare_id!("FoifQqF6jRL6nzfkF7EpWsjTEdfA4cHx7ikb5zraMq1V");

#[program]
pub mod dcent_music {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let mut x = 0;
        for n in 1..10{
            if n == 10{
                break;
            }
            x += n;
        }
        msg!("Greetings from: {:?}\nValue of x: {:?}", ctx.program_id,x);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}