# Administrator Guide — HawkEdge Version 1.0

This guide documents operations inside the HawkEdge Administrative Portal (Mission Control).

---

## 💻 Portal Overview

The Admin portal is accessible locally at `http://localhost:3002` (or `https://admin.hawkedge.tech` in production) and is restricted to users with `ADMIN` and `SUPER_ADMIN` ranks:

1. **CRM & Lead Control**: Track leads created from landing page Discovery form entries. Review lead scores and priorities.
2. **Consultation Alignment**: Review and confirm booked consultation meetings.
3. **Proposals Builder**: Draft and edit service Category templates (Software, AI, DevOps) and generate client contracts.
4. **Client Projects Cockpit**: Create project records, update budget constraints, and assign milestones.
5. **System Audit Logs**: Track user login updates and database transactions history.

---

## ⚙️ Administrative Workflows

### 1. Compiling and Accept a Client Proposal
- Open the lead detail view.
- Under **Proposals**, click **Create Proposal** and select the Category template (e.g. `SOFTWARE`).
- Set proposal status to `SENT` for client review.
- Once accepted by the client, the system automatically:
  - Changes lead status to `CLOSED_WON`.
  - Creates the client user account.
  - Provisions the project and sets up default milestones.

### 2. Monitoring Staging logs
- Navigate to the **System Logs** dashboard inside the Admin portal.
- Review database diagnostic messages, rate limit blocks, and general API response latency metrics.
