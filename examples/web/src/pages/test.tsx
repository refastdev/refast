import { Link, useLoader } from '@refastdev/refast';

export const Loader = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    ddd: 'test',
  };
};

export default function Test() {
  const data = useLoader<{ data: string }>();
  console.log(data);
  return (
    <div>
      <div>Test Page</div>
      <div></div>
    </div>
  );
}
