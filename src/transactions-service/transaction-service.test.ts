import { setup } from "../server";
// import * as handlers from "./handlers";

// let's call this database seeding...
import { DB as ACCOUNT_DB } from "../accounts-service/handlers";
ACCOUNT_DB.push(
  {
    id: "001",
    balance: 100000000.0,
    nickname: "Internal Clearing House",
  },
  {
    id: "002",
    balance: 1000000.0,
    nickname: "My GME Wins",
  },
  {
    id: "003",
    balance: 100.0,
    nickname: "I Bought ATH",
  }
);

const api = setup();

const f = {
  transaction_id_good: "",
  transaction_good: {
    source_account_id: "002",
    target_account_id: "001",
    amount: 10000.0,
  },
  transaction_bad_amount: {
    source_account_id: "002",
    target_account_id: "001",
    amount: -10000.0,
  },
  transaction_bad_source: {
    target_account_id: "001",
    amount: 10000.0,
  },
  transaction_bad_target: {
    source_account_id: "002",
    amount: 10000.0,
  },
};

describe("The transaction service", () => {
  afterAll(() => api.close());

  test("should execute a transaction producing both credit and debit legs", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/transaction",
      payload: f.transaction_good,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(200);
    expect(body).toHaveProperty("transaction_id");
    expect(body.transaction_id).toBeTruthy();
    expect(body.transaction_id.length).toBeGreaterThan(0);

    f.transaction_id_good = body.transaction_id;

    done();
  });

  test("should get both credit and debit transactions for a transaction ID", async (done) => {
    const res = await api.inject({
      method: "GET",
      url: `/transaction/${f.transaction_id_good}`,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(200);
    expect(body).toHaveProperty("debit");
    expect(body).toHaveProperty("credit");
    expect(body.debit.side).toBe("debit");
    expect(body.credit.side).toBe("credit");
    expect(body.debit.amount).toBe(f.transaction_good.amount);
    expect(body.credit.amount).toBe(f.transaction_good.amount);
    expect(body.debit.transaction_id).toBe(f.transaction_id_good);
    expect(body.credit.transaction_id).toBe(f.transaction_id_good);
    expect(body.debit.account_id).toBe(f.transaction_good.source_account_id);
    expect(body.credit.account_id).toBe(f.transaction_good.target_account_id);

    done();
  });

  test("should fail to execute a transaction when the amount is invalid", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/transaction",
      payload: f.transaction_bad_amount,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(400);
    expect(body.message).toBe("Invalid or missing amount provided.");

    done();
  });

  test("should fail to execute a transaction when the source account is invalid", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/transaction",
      payload: f.transaction_bad_source,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(400);
    expect(body.message).toBe("No source account ID provided.");

    done();
  });

  test("should fail to execute a transaction when the target account is invalid", async (done) => {
    const res = await api.inject({
      method: "POST",
      url: "/transaction",
      payload: f.transaction_bad_target,
    });

    const body = JSON.parse(res.body);
    expect(res.statusCode).toEqual(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
    expect(body.code).toBe(400);
    expect(body.message).toBe("No target account ID provided.");

    done();
  });
});
