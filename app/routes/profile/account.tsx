import React from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";

export default function AcccountRoute() {
  return (
    <div className="mt-20">
      account
      <Form method="post" action="/logout">
        <Button variant="outline">Logout</Button>
      </Form>
    </div>
  );
}
