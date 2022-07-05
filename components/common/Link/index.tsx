import { forwardRef, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

// allow this component to accept all properties of "a" tag
interface IProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  // we can add more properties we need from next/link in the future
}

// Forward Refs, is useful
//eslint-disable-next-line react/display-name
export default forwardRef(({ to, ...props }: IProps, ref: any) => {
  return (
    <Link href={to}>
      <a {...props} ref={ref} />
    </Link>
  );
});
