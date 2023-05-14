import { screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { renderWith } from "shared/test/renderWith";

describe("SidebarTest", () => {
  test("SidebarIsShow", () => {
    renderWith(<Sidebar isOpen={true} />);
    screen.debug();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});
