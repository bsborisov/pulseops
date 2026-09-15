import {
  expect,
  test,
} from "@playwright/test";

test(
  "preserves dashboard state while navigating",
  async ({
    page,
  }) => {
    await page.goto(
      "/?range=1h&env=staging",
    );

    await page
      .getByRole(
        "link",
        {
          name: /traffic/i,
        },
      )
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/traffic\?range=1h&env=staging/,
    );

    await page
      .getByRole(
        "link",
        {
          name: /services/i,
        },
      )
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/services\?range=1h&env=staging/,
    );

    await page
      .getByRole(
        "link",
        {
          name: /requests/i,
        },
      )
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/requests\?range=1h&env=staging/,
    );
  },
);

test(
  "opens a service detail and preserves dashboard state",
  async ({
    page,
  }) => {
    await page.goto(
      "/services?range=15m&env=staging",
    );

    await page
      .getByRole(
        "link",
        {
          name: /payments/i,
        },
      )
      .first()
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/services\/payments\?range=15m&env=staging/,
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name: /payments/i,
        },
      ),
    ).toBeVisible();
  },
);