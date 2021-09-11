import { NextPage } from "next"
import React, { ReactElement } from "react"
import AuthenticationDialog from "src/components/auth/AuthenticationDialog"
import { BaseLayout } from "src/layouts"

const RegisterPage: NextPage = (): ReactElement => {
  return (
    <>
      <AuthenticationDialog registration={true} />
    </>
  )
}

export default BaseLayout(RegisterPage)
