import { Link, useAsyncLoader } from '@refastdev/refast';

export const Loader = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    data: 'test',
  };
};

export default function Test() {
  const data = useAsyncLoader<{ data: string }>();
  console.log(data);
  return (
    <div>
      <div>Test Page</div>
      <div>
        <Link to="/">Jump Index Page</Link>
      </div>
    </div>
  );
}
