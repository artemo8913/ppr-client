import { screen, render } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { renderWith } from "shared/test/renderWith";

describe("SidebarTest", () => {
  test("SidebarIsShow", () => {
    renderWith(<Sidebar isOpen={true} />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});
