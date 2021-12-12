import {DeployFunction} from 'hardhat-deploy/types';


const func: DeployFunction = async function ({deployments, getNamedAccounts, network, getChainId}) {
    const {deploy} = deployments;
    const {owner} = await getNamedAccounts();

    console.log('chainId:', await getChainId());
    await deploy('Payment', {
        from: owner,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true
    });

    await deploy('MockToken', {
        from: owner,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true
    });


};
export default func;
func.tags = ['deployPayment'];
