import { Link } from '@refastdev/refast';

export default function Index() {
  return (
    <div>
      <div>Index Page</div>
      <div>
        <div>
          <Link to="/test">Jump Test Page</Link>
        </div>
        <div>
          <Link to="/test_auth">Jump Test Auth Page</Link>
        </div>
        <div>
          <Link to="/sub">Jump Sub Page</Link>
        </div>
      </div>
    </div>
  );
}
