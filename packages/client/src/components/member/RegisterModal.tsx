import { useSetAtom } from 'jotai';
import { useState } from 'react';
import styled from 'styled-components';
import { isModalOpenedAtom } from '../../app/login';

const ModalWrapper = styled.div`
  z-index: 99;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: gray;
  border: 1px solid black;
  border-radius: 8px;

  width: 300px;
  height: 300px;
`;

const ModalBtn = styled.button`
  position: absolute;
  padding: 1% 2%;
  cursor: pointer;
`;

function RegisterModal() {
  const setIsModalOpened = useSetAtom(isModalOpenedAtom);

  function closeModal() {
    setIsModalOpened(false);
  }

  return (
    <ModalWrapper>
      <ModalBtn onClick={closeModal}>X</ModalBtn>
    </ModalWrapper>
  );
}

export default RegisterModal;
