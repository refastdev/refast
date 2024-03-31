import { Link, useLoader } from '@refastdev/refast';

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
  const data = useLoader<{ data: string }>();
  console.log(data);
  return (
    <div>
      <div>TestAuth Page</div>
      <div></div>
    </div>
  );
}
