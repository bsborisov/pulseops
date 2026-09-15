import {
  expect,
  test,
} from "@playwright/test";

test(
  "updates an incident optimistically",
  async ({
    page,
  }) => {
    await page.route(
      "**/api/incidents/**",
      async (route) => {
        await new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              1_200,
            );
          },
        );

        await route.continue();
      },
    );

    await page.goto(
      "/incidents",
    );

    const actionableIncident =
      page
        .locator(
          "article[data-incident-id]",
        )
        .filter({
          has: page.getByRole(
            "button",
            {
              name:
                "Resolve",
            },
          ),
        })
        .first();

    await expect(
      actionableIncident,
    ).toBeVisible();

    const incidentId =
      await actionableIncident.getAttribute(
        "data-incident-id",
      );

    expect(
      incidentId,
    ).not.toBeNull();

    const incident =
      page.locator(
        `article[data-incident-id="${incidentId}"]`,
      );

    await incident
      .getByRole(
        "button",
        {
          name:
            "Resolve",
        },
      )
      .click();

    await expect(
      incident,
    ).toContainText(
      /resolved/i,
      {
        timeout: 500,
      },
    );

    await expect(
      incident,
    ).toContainText(
      /resolved/i,
      {
        timeout: 3_000,
      },
    );
  },
);

test(
  "rolls back an incident when the mutation fails",
  async ({
    page,
  }) => {
    await page.route(
      "**/api/incidents/**",
      async (route) => {
        if (
          route.request()
            .method() ===
          "PATCH"
        ) {
          await new Promise(
            (resolve) => {
              setTimeout(
                resolve,
                600,
              );
            },
          );

          await route.fulfill({
            status: 500,

            contentType:
              "application/json",

            body:
              JSON.stringify({
                error:
                  "Simulated incident update failure",
              }),
          });

          return;
        }

        await route.continue();
      },
    );

    await page.goto(
      "/incidents",
    );

    const actionable =
      page
        .locator(
          "article[data-incident-id]",
        )
        .filter({
          has: page.getByRole(
            "button",
            {
              name:
                "Resolve",
            },
          ),
        })
        .first();

    const id =
      await actionable.getAttribute(
        "data-incident-id",
      );

    expect(id).not.toBeNull();

    const incident =
      page.locator(
        `article[data-incident-id="${id}"]`,
      );

    const before =
      await incident.textContent();

    await incident
      .getByRole(
        "button",
        {
          name:
            "Resolve",
        },
      )
      .click();

    // Optimistic state.
    await expect(
      incident,
    ).toContainText(
      /resolved/i,
      {
        timeout: 400,
      },
    );

    // Server rejects it.
    await expect(
      incident,
    ).not.toContainText(
      /resolved/i,
      {
        timeout: 2_000,
      },
    );

    await expect(
      incident,
    ).toContainText(
      /simulated incident update failure/i,
    );

    expect(
      await incident.textContent(),
    ).not.toBe(before);
  },
);