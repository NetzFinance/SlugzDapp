// toastMessages.js

import { useToast } from "@chakra-ui/react";

export function useToastMessages() {
  const toast = useToast();

  const handleSuccessStake = () => {
    toast({
      title: "Your tokens have been staked",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessSwap = () => {
    toast({
      title: "Your tokens have been staked",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorSwap = () => {
    toast({
      title: "Your tokens have been staked",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessApprove = () => {
    toast({
      title: "Token approval was successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessWithdraw = () => {
    toast({
      title: "Withdrawal of staked tokens was successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessClaim = () => {
    toast({
      title: "Claim Rewards successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorStake = () => {
    toast({
      title:
        "Something went wrong whilst trying to stake your tokens, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorClaim = () => {
    toast({
      title:
        "Something went wrong whilst trying to claim your rewards, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorWithdraw = () => {
    toast({
      title:
        "Something went wrong whilst trying to withdraw your staked tokens, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessMint = () => {
    toast({
      title: "NFT Mint successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorMint = () => {
    toast({
      title:
        "Something went wrong whilst trying to mint your NFT, if this wasnt you please try again. If the error persists contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorApprove = () => {
    toast({
      title:
        "Something went wrong whilst trying to approve ERC20 Spending, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessWrap = () => {
    toast({
      title: "Wrap CRO successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorWrap = () => {
    toast({
      title:
        "Something went wrong whilst trying to Wrap your CRO, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessUnWrap = () => {
    toast({
      title: "Unwrap CRO successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorUnWrap = () => {
    toast({
      title:
        "Something went wrong whilst trying to Unwrap your CRO, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccessTransfer = () => {
    toast({
      title: "Token Transfer was successful",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleErrorTransfer = () => {
    toast({
      title:
        "Something went wrong whilst trying to transfer your tokens, if this wasn't you please try again. If the error persists, contact us on discord.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handles = {
    handleErrorTransfer,
    handleSuccessTransfer,
    handleErrorWrap,
    handleSuccessWrap,
    handleSuccessUnWrap,
    handleErrorUnWrap,
    handleSuccessStake,
    handleSuccessApprove,
    handleSuccessWithdraw,
    handleSuccessClaim,
    handleErrorStake,
    handleErrorClaim,
    handleErrorWithdraw,
    handleErrorApprove,
    handleSuccessMint,
    handleErrorMint,
    handleErrorSwap,
    handleSuccessSwap,
  };

  return {
    handles,
  };
}
