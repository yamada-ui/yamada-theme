import type { GetServerSidePropsContext } from "next"

export const getServerSideCommonProps = ({
  req,
}: GetServerSidePropsContext) => {
  const cookies = req.headers.cookie ?? ""

  return { props: { cookies } }
}
