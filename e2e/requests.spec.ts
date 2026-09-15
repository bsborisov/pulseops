import {
  expect,
  test,
} from "@playwright/test";

test(
  "synchronizes request filters with the URL",
  async ({
    page,
  }) => {
    await page.goto(
      "/requests?range=1h&env=staging",
    );

    await page
      .getByLabel("Method")
      .selectOption("POST");

    await expect(
      page,
    ).toHaveURL(
      /method=POST/,
    );

    await expect(
      page,
    ).toHaveURL(
      /range=1h/,
    );

    await expect(
      page,
    ).toHaveURL(
      /env=staging/,
    );

    await page
      .getByLabel("Region")
      .selectOption("EU");

    await expect(
      page,
    ).toHaveURL(
      /region=EU/,
    );

    await page
      .getByRole(
        "button",
        {
          name: /clear/i,
        },
      )
      .click();

    await expect(
      page,
    ).not.toHaveURL(
      /method=POST/,
    );

    await expect(
      page,
    ).not.toHaveURL(
      /region=EU/,
    );

    // Global dashboard state survives.
    await expect(
      page,
    ).toHaveURL(
      /range=1h/,
    );

    await expect(
      page,
    ).toHaveURL(
      /env=staging/,
    );
  },
);

test(
  "opens and closes request details",
  async ({
    page,
  }) => {
    await page.goto(
      "/requests",
    );

    await expect
      .poll(
        async () =>
          Number(
            await page
              .getByTestId(
                "request-result-count",
              )
              .textContent(),
          ),
        {
          timeout: 10_000,
        },
      )
      .toBeGreaterThan(0);

    await page
      .getByTestId(
        "request-row",
      )
      .first()
      .click();

    await expect(
      page.getByRole(
        "dialog",
        {
          name:
            "Request details",
        },
      ),
    ).toBeVisible();

    await expect(
      page,
    ).toHaveURL(
      /request=/,
    );

    await page.keyboard.press(
      "Escape",
    );

    await expect(
      page.getByRole(
        "dialog",
        {
          name:
            "Request details",
        },
      ),
    ).toBeHidden();

    await expect(
      page,
    ).not.toHaveURL(
      /request=/,
    );
  },
);

test(
  "virtualizes a large realtime request buffer",
  async ({
    page,
  }) => {
    await page.goto(
      "/requests",
    );

    const logicalCount =
      page.getByTestId(
        "request-result-count",
      );

    // Simulator currently emits roughly
    // 24 requests / second, so this should
    // happen quickly without manufacturing
    // fake browser data.
    await expect
      .poll(
        async () =>
          Number(
            await logicalCount
              .textContent(),
          ),
        {
          timeout: 15_000,
        },
      )
      .toBeGreaterThanOrEqual(
        80,
      );

    const total =
      Number(
        await logicalCount
          .textContent(),
      );

    const renderedRows =
      await page
        .getByTestId(
          "request-row",
        )
        .count();

    expect(total).toBeGreaterThanOrEqual(
      80,
    );

    expect(
      renderedRows,
    ).toBeLessThan(
      total,
    );

    expect(
      renderedRows,
    ).toBeLessThan(
      60,
    );
  },
);