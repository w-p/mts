# MTS

A brief exercise to build a money transfer system.

### TL;DR

To see if this works, clone the repo and do:

```
npm install .
npm run test
```

If that works, then do:

```
npm run start
```

and navigate to `http://0.0.0.0:8080/docs`.

If that doesn't work, which is unlikely but entirely possible, reach out to me and I'll try to resolve the issue.

### General Requirements of the Exercise

- Deposit
  - From Bank to MTS
- Transfer
  - Inter-account
  - Asset allocation
  - Discretionary Purchases
- Withdraw
  - From MTS to Bank
- Transparent Transaction Log
  - What do I have? Balances
  - How am I doing? Return
  - What did I do? Transactions

### Architecture

The systems would be designed for low operational and fiscal overhead while being scalable enough to handle extreme surges in activity. Each functional component of the system would exist as its own service as a part of what is commonly referred to as a microservices architecture. In basic terms, this means that each service is a black box that is accessed by way of an agreed upon contract to which all other services must adhere.

This system would be composed of several components. A mobile application, a user-facing SPA or single page (web) application, a REST API that is augmented by WebSockets where applicable, and an administrative SPA for operations and support. Persistence is addressed with DynamoDB and S3 for documents and batch data persistence. Long-term storage is addressed with tiered options such as Glacier.

To that end, the core AWS services involved would be:

1. Cognito for user and device authentication
2. CloudFront, Route53, API Gateway: SPA hosting, DNS, API
3. Lambda: Serverless API Functions / Handlers
4. DynamoDB: Persistence
5. S3, Glacier: SPA hosting, documents, and long-term storage

Upon further investigation into this space, I concluded that I would probably contact Plaid and Stripe before proceeding with any development. I've worked with Stripe and some other payment / card processing companies before. Plaid feels like Stripe on the surface. So, more than likely I would architect this system to be an integration and services layer on top of those systems with a lot of quality of life / usability features packaged into web and mobile applications. The fees associated with Plaid and Stripe are well worth the increased level of focus, clarity, and domain expertise that your engineering resources can develop and apply to the project.

### Discussion

The example code here only scratches the surface of what a final implementation would look like. Given the time constraints it is challenging to design, implement, test, and refactor the system in the way that is descriptive or qualitative. For example, several key but illustrative services are missing from this POC such as a user service for authentication and RBAC or an auditing service for recording successful and failed actions or a metrics service for recording data for future analytical use. Additionally, the 'database' is simply an array which 'works' but does not reflect the additional integration effort required.

I also tried to use a framework I'd never used before. Fastify. It was a great learning experience. I've used several others in the past (express, koa, restify, flask, falcon, gin, etc.) and I'm not sure I like this one. I've heard that the performance is outstanding but the use of frameworks is of less value when targeting Lambda as your runtime environment. The testing situation is also quite burdensome. Fastify seems good for moving fast but maybe a bit clunky for embarking on a long-haul effort.

### Development and Release

Engineers build robots that build robots that build robots. So, the system would be tested locally, then tested and deployed via a CI/CD pipeline (preferably GitLab). Deployment would be predicated on a few core criteria:

1. All tests pass
2. 80% or greater coverage

Deployments would be targeted at 4 distinct environments.

1. Local: Used for daily development on a laptop
2. Dev: A separate AWS account for validating changes, the sandbox
3. Test: A separate AWS account for automated testing, destroyed routinely
4. Prod: A separate AWS account for our users, never touched by anyone

### License

MIT
