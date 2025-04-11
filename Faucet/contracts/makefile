include .env

deploy_lulucoin:
	@echo "Deploying LuLuCoin contract..."
	forge create src/LuLuCoin.sol:LuLuCoin --private-key ${OWNER_PRIVATE_KEY} --broadcast --constructor-args ${OWNER_ADDRESS}

deploy_faucet:
	@echo "Deploying LLCFaucet contract..."
	forge create --private-key ${OWNER_PRIVATE_KEY} src/LLCFaucet.sol:LLCFaucet --broadcast --constructor-args ${LLC_CONTRACT} ${DRIP_INTERVAL} ${DRIP_LIMIT} ${OWNER_ADDRESS}

mint:
	@echo "Minting tokens..."
	cast send ${LLC_CONTRACT} "mint(uint256)" ${MINT_AMOUNT} --private-key ${OWNER_PRIVATE_KEY}

balance_of_owner:
	@echo "Getting balance of the owner..."
	cast call ${LLC_CONTRACT} "balanceOf(address)" ${OWNER_ADDRESS}

approve_faucet:
	@echo "Approving faucet contract to spend tokens..."
	cast send ${LLC_CONTRACT} "approve(address,uint256)" ${FAUCET_CONTRACT} ${DEPOSIT_AMOUNT} --private-key ${OWNER_PRIVATE_KEY}

drip:
	@echo "Dripping tokens from faucet..."
	cast send ${FAUCET_CONTRACT} "drip(uint256)" ${DRIP_AMOUNT} --private-key ${USER_PRIVATE_KEY}

deposit:
	@echo "Depositing tokens to faucet..."
	cast send ${FAUCET_CONTRACT} "deposit(uint256)" ${DEPOSIT_AMOUNT} --private-key ${OWNER_PRIVATE_KEY}

balance_of_faucet:
	@echo "Getting balance of the faucet contract..."
	cast call ${LLC_CONTRACT} "balanceOf(address)" ${FAUCET_CONTRACT}

balance_of_user:
	@echo "Getting balance of the faucet contract..."
	cast call ${LLC_CONTRACT} "balanceOf(address)" ${USER_ADDRESS}
