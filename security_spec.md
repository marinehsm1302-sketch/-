# KIA Tigers POD Goods Platform Security Specification

## 1. Data Invariants
- **Memes collection (/memes/{memeId})**:
  - `votes` must are integers and cannot decrease. Only incremental vote updates are permitted.
  - Meme details like `title` and `origin` cannot be overwritten or altered by standard clients (immutability).
- **Cheers collection (/cheers/{cheerId})**:
  - Every comment is single-write only (created with server-side time verification). Update or deletion is forbidden.
  - The ID of a comment must match standard limits to avoid Denial of Wallet attacks.
- **Orders collection (/orders/{orderId})**:
  - Relational parameters like `customerName`, `email`, and `address` must conform to proper sizes.
  - A client cannot update an order once it exits the `PENDING` state.

---

## 2. The "Dirty Dozen" Adversarial Payloads
Here are 12 malicious payloads designed to abuse the database layers:
1. **Meme Title Sabotage**: Modifying a meme title from "삐끼삐끼" to malicious script tags.
2. **Negative Vote Shift**: Sending a decreased vote payload (`votes: -100`) to reset a rival team's hype index.
3. **Ghost Fields Injection**: Setting undocumented system privileges `isAdmin: true` on user or session maps.
4. **Massive Overwrite on Meme votes**: Incrementing votes by `99999` in a single write.
5. **Cheer Deletion**: A user attempting to wipe another fan's friendly banter.
6. **Cheer Timestamp Theft**: Sending a future timestamp in `createdAt` to bypass timeline sorting.
7. **Junk Character ID Attack**: Injecting a massive 2MB junk text into `cheerId` path variable.
8. **PII Blanket Read Query**: Querying full orders list matching another consumer's email or address.
9. **Orders State Shortcutting**: Moving an order directly from `PENDING` to `COMPLETED` by skipping delivery actions.
10. **Immortal Fields Mutation**: Modifying `createdAt` inside order history to shift billing dates.
11. **Order Total Price Inflation**: Injecting negative amounts to bypass pricing checks.
12. **Self-Assigned Admin Escalation**: Attempting to write into `/admins/{uid}` manually.

---

## 3. The Test Runner Structure
The mock test runner blueprint below evaluates the database gates before compile phases:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

describe("KIA Tigers Fortress Rules Unit Test", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "cedar-oarlock-jsx2c",
      firestore: {
        host: "localhost",
        port: 8080,
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("should block unauthenticated clients from altering historic meme definitions", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(db.doc("memes/meme_ppippi").update({ title: "Sabotaged" }));
  });

  it("should prevent decreasing meme vote counts", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(db.doc("memes/meme_ppippi").update({ votes: 0 }));
  });
});
```
