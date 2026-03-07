export const runtime = 'edge';

export async function GET() {
  return new Response('OK');
}

export async function POST() {
  return new Response('OK');
}

export default function RegistroPage() {
  return (
    <div>
      <h1>Registro</h1>
    </div>
  );
}
