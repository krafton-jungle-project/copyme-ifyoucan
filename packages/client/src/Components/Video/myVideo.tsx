import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.video`
	width: 240,
	height: 240,
	margin: 5,
	backgroundColor: 'black',
`;

const UserLabel = styled.p`
	display: inline-block;
	position: absolute;
	top: 230px;
	left: 0px;
`;

interface Props {
	stream: MediaStream;
	nickName: string;
}

const MyVideo = ({ stream, nickName }: Props) => {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);

	return (
		<><VideoContainer ref={ref} autoPlay /><UserLabel>{nickName}</UserLabel></>
	);
};

export default MyVideo;