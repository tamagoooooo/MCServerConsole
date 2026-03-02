import Inside from "./inside"

type Props = {
  params: Promise<{ name: string }>
}

export default async function AdminDashboard(props:Props) {
  const name = (await props.params).name;
  return (
    <Inside name={name} />
  )
}
