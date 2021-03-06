import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useLoginMutation } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";
import { mapFormErrors } from "../utils/mapFormErrors";

const Login = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Layout>
      <Flex dir="column" justify="center" align="center">
        <Box w={400}>
          <Heading>Login</Heading>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login(values);
              if (response.data?.login.errors) {
                const errors = mapFormErrors(response.data?.login.errors);
                setErrors(errors);
                return;
              }

              const params = qs.parse(location.search);
              const backPath = params?.back as string | undefined;
              if (backPath) router.push(backPath);
              else router.push("/");
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username/email"
                  label="Username or Email"
                />
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
                <Flex mt={4} justify="space-between" align="center">
                  <Button type="submit" isLoading={isSubmitting}>
                    Login
                  </Button>
                  <Link as={NextLink} href="/register">
                    Register Instead
                  </Link>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
