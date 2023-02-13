// import React, { useEffect, useState } from 'react';

// // const User = {
// //   id: 'test1234',
// //   pw: 'test2323',
// // };

// export default function Login() {
//   const [id, setId] = useState('');
//   const [pw, setPw] = useState('');
//   const [name, setName] = useState('');
//   const register =()=>{

//   }

//   const [idValid, setIdValid] = useState(false);
//   const [pwValid, setPwValid] = useState(false);
//   // const [notAllow, setNotAllow] = useState(true);

//   // useEffect(() => {
//   //   if (idValid && pwValid) {
//   //     setNotAllow(false);
//   //     return;
//   //   }
//   //   setNotAllow(true);
//   // }, [idValid, pwValid]);

//   const handleId = (e) => {
//     setId(e.target.value);
//     const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
//     if (regex.test(e.target.value)) {
//       setIdValid(true);
//     } else {
//       setIdValid(false);
//     }
//   };
//   const handlePw = (e) => {
//     setPw(e.target.value);
//     const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
//     if (regex.test(e.target.value)) {
//       setPwValid(true);
//     } else {
//       setPwValid(false);
//     }
//   };

//   const handleName = (e) => {
//     setName(e.target.value);
//   };
//   //   const onClickConfirmButton = () => {
//   //     if (id === User.id && pw === User.pw) {
//   //       alert('회원가입에 성공했습니다.');
//   //     } else {
//   //       alert('등록에 실패했습니다.');
//   //     }
//   //   };

//   return (
//     <div className='page'>
//       <div className='titleWrap'>회원가입</div>

//       <div className='contentWrap'>
//         <div className='inputTitle'>아이디</div>
//         <div className='inputWrap'>
//           <input
//             className='input'
//             type='text'
//             placeholder='test1234'
//             value={id}
//             onChange={handleId}
//           />
//         </div>
//         <div className='errorMessageWrap'>
//           {!idValid && id.length > 0 && (
//             <div>올바른 아이디을 입력해주세요.</div>
//           )}
//         </div>

//         <div style={{ marginTop: '26px' }} className='inputTitle'>
//           비밀번호
//         </div>
//         <div className='inputWrap'>
//           <input
//             className='input'
//             type='password'
//             placeholder='영문, 숫자 포함'
//             value={pw}
//             onChange={handlePw}
//           />
//         </div>
//         <div className='errorMessageWrap'>
//           {!pwValid && pw.length > 0 && <div>영문, 숫자를 입력해주세요.</div>}
//         </div>
//         <div style={{ marginTop: '26px' }} className='inputTitle'>
//           닉네임
//         </div>
//         <div className='inputWrap'>
//           <input
//             className='input'
//             type='name'
//             placeholder='닉네임'
//             value={name}
//             onChange={handleName}
//           />
//         </div>
//       </div>

//       <div>
//         <button
//           onClick={() => register();}
//           // disabled={notAllow}
//           className='CompleteButton'
//         >
//           가입하기
//         </button>
//       </div>
//     </div>
//   );
// }
