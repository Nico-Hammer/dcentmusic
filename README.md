# Setup
<<<<<<< HEAD
Below is a condensed version of the setup instructions from [anchor-lang](https://www.anchor-lang.com/docs/installation)
=======
>>>>>>> 544c3fab9b62f7d062b53d9a564937a467a3b489
## Dependencies
To build the program you will need a linux system or a windows system capable of running WSL2 as well as the following packages:
* build-essential
* pkg-config
* libudev-dev
* llvm
* libclang-dev
* protobuf-compiler
* libssl-dev
* the rust programming language (installed via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`)
* solana cli (installed via `sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`)
* anchor cli (installed via `cargo install --git https://github.com/coral-xyz/anchor avm --force`)
## Anchor setup
After dependencies have been installed you can setup anchor by running `avm install latest && avm use latest`
## Solana setup
The solana setup is multiple steps, which are:
1. tell solana cluster to use the local network with `solana config set -ul`
2. create a solana wallet with `solana-keygen new`
3. get solana funds with `solana airdrop <amount>`
4. run solana test validator with `solana-test-validator` to use the server (this should be be running in the background)
## Project commands
* use `anchor build` to build the project
* use `anchor test` to run the tests specified in the tests folder
* use `anchor deploy` to deploy the program to the solana cluster specifed in the `Anchor.toml` file, if this isnt changed then it should be the solana-test-validator running in the background from above
# Planned features
1. Solana blockchain integration
2. Web app frontend
3. User accounts
4. Music playback (stop,play,forward seek,backward seek)
5. File upload (music files, album art, lyrics)
6. Ability to organize files into albums
7. Ability to purchase music (songs and albums)
8. Ability to tip the musicians
9. "Discovery" page to show new uploads
10. Ability to search for songs and/or artists
