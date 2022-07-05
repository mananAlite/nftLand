import Image from 'next/image';

import NFTLand from '../../assets/images/logo/nftland.svg';

function LogoIcon(): JSX.Element {
  return <Image src={NFTLand} alt="NFT Land" priority height={90} width={90} />;
}
export default LogoIcon;
