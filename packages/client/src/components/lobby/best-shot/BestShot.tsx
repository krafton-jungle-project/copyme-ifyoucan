import axios from 'axios';
// import { Blob } from 'buffer';
import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Paging } from './Paging';

//todo: 경기 사진이나 동영상 가져올 때 정보 가져와야하므로 다시 고려해야함

export default function BestShot() {
  const [data, setData] = useState({ img: '', i: 0 });
  const [images, setImages] = useState<string[]>([]);
  // const [downloadUrl, setDownloadUrl] = useState<string>('');
  //리스트에 나타낼 아이템
  const [count, setCount] = useState(0); //아이템 총 개수
  const [currentpage, setCurrentpage] = useState(1); //현재페이지
  const [postPerPage] = useState(8); //페이지당 아이템 개수

  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setCount(images.length);
    setIndexOfLastPost(currentpage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentImages(images.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentpage, indexOfFirstPost, indexOfLastPost, images, postPerPage]);

  const setPage = (e: number) => {
    setCurrentpage(e);
  };

  useEffect(() => {
    const getMyImages = async () => {
      if (document.cookie) {
        const token = document.cookie.split('=')[1];
        try {
          const res = await axios.get('http://localhost:5001/users/', {
            // const res = await axios.get('http://15.165.237.195:5001/users/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res) {
            console.log(res);
            const imgurls = res.data.data.imgurl;
            setImages(imgurls.reverse());
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMyImages();
  }, []);

  const viewImage = async (img: string, i: number) => {
    setData({ img, i });
  };

  const imgAction = (action: string) => {
    let i = data.i;
    if (action === 'next-img') {
      setData({ img: currentImages[i + 1], i: i + 1 });
      console.log(data.img);
    }
    if (action === 'previous-img') {
      setData({ img: currentImages[i - 1], i: i - 1 });
    }
    if (!action) {
      setData({ img: '', i: 0 });
    }
  };

  return (
    <>
      {data.img && (
        <div
          style={{
            width: '100%',
            height: '100vh',
            background: 'black',
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => imgAction('')}
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            X
          </button>
          <button onClick={() => imgAction('previous-img')}>Previous</button>
          <img
            src={data.img}
            style={{ width: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            alt=""
          />
          <button onClick={() => imgAction('next-img')}>Next</button>
          <a href={data.img} download target="_self">
            {/* <a href=`` download> */}
            {/* <a href={sample} download> */}
            {/* <button onClick={() => downloadFile(data.img)} type="button"> */}
            {/* 다운로드 */}
            {/* </button> */}
            <button type="button">다운로드</button>
          </a>
        </div>
      )}
      <div style={{ padding: '30px' }}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1050: 4 }}>
          <Masonry gutter="30px">
            {currentImages.map((image, i) => (
              <img
                key={i}
                src={image}
                style={{ width: '50%', display: 'block', cursor: 'pointer' }}
                alt=""
                onClick={() => viewImage(image, i)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      <Paging page={currentpage} count={count} setPage={setPage} />
    </>
  );
}
