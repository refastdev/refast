import { Link, useAsyncLoader } from '@refastdev/refast';

export const Loader = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    data: 'test',
  };
};

export const IsAuth = (token: any) => {
  return token;
};

export default function TestAuth() {
  const data = useAsyncLoader<{ data: string }>();
  console.log(data);
  return (
    <div>
      <div>TestAuth Page</div>
      <div>
        <Link to="/">Jump Index Page</Link>
      </div>
    </div>
  );
}
