import { setup } from "../server";

const api = setup();

const f = {
  account_id_good: "",
  account_id_bad: "abc-123",
  create_account_good: { nickname: "My Account" },
  create_account_bad: { name: "This Isn't Right" },
  account_balance_good: { balance: 100.0 },
  account_balance_bad: { balance: -1.0 },
};

describe("The account service", () => {
  afterAll(() => api.close());

  test("should create an account from a 'nickname'", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/account",
      payload: f.create_account_good,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(200);
    expect(body).toHaveProperty("id");
    expect(body.id).toBeTruthy();
    expect(body.id.length).toBeGreaterThan(0);

    f.account_id_good = body.id;

    done();
  });

  test("should fail to create an account with the same 'nickname'", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/account",
      payload: f.create_account_good,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(409);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(409);
    expect(body.message).toBe("An account with this nickname already exists.");

    done();
  });

  test("should fail to create an account without 'nickname'", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/account",
      payload: f.create_account_bad,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(400);
    expect(body.message).toBe("Invalid or missing nickname.");

    done();
  });

  test("should get an existing account by ID", async (done) => {
    const res = await api.inject({
      method: "GET",
      url: `/account/${f.account_id_good}`,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(200);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("balance");
    expect(body).toHaveProperty("nickname");
    expect(body.id).toBeTruthy();
    expect(body.id.length).toBeGreaterThan(0);
    expect(body.balance).toBeGreaterThanOrEqual(0);
    expect(body.nickname).toBe(f.create_account_good.nickname);

    done();
  });

  test("should fail to get an account by a non-existent ID", async (done) => {
    const res = await api.inject({
      method: "GET",
      url: `/account/${f.account_id_bad}`,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(404);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(404);
    expect(body.message).toBe("Account not found.");

    done();
  });

  // test("should update an account balance", async (done) => {
  //   const res = await api.inject({
  //     method: "PUT",
  //     url: `/account/${f.account_id_good}`,
  //     payload: f.account_balance_good,
  //   });

  //   expect(res.statusCode).toEqual(200);

  //   done();
  // });

  test("should fail to update an account with a negative balance", async (done) => {
    // why - because we should not allow negative balances to occur anywhere in
    // the system until such time as we implement margin accounts.
    const res = await api.inject({
      method: "PUT",
      url: `/account/${f.account_id_good}`,
      payload: f.account_balance_bad,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(400);
    expect(body.message).toBe(
      `Balance '${f.account_balance_bad.balance}' is missing or non-negative.`
    );

    done();
  });
});
