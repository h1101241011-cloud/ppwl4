import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .post("/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )
  .listen(3000);

  app.get(
    "/products/:id",
    ({ params, query }) => {
      return {
        message: "Product detail",
        id: params.id,
        sort: query.sort ?? "asc"
      };
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      query: t.Object({
        sort: t.Optional(
          t.Union([
            t.Literal("asc"),
            t.Literal("desc")
          ])
        )
      })
    }
  )

   app.get(
    "/stats",
    () => {
      return {
        total: 100,
        active: 75
      };
    },
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )
  
  .get(
    "/admin",
    () => {
      return {
        stats: 99
      }
    },
    {
      beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401
          return {
            success: false,
            message: "Unauthorized"
          }
        }
      }
    }
  )

  app.get("/product", () => {
    return {
      id: 1,
      name: "Laptop"
    };
  })

  app.post(
    "/login",
    ({ body }) => {
      return {
        message: "Login berhasil"
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 })
      })
    }
  )

  app.onError(({ code, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error"
      };
    }

    // Default error
    set.status = 500;
    return {
      success: false,
      error: "Internal Server Error"
    };
  })
  
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);