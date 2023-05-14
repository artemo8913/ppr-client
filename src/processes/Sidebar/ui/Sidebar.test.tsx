import { screen, render } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { renderWith } from "shared/test/renderWith";

describe("SidebarTest", () => {
  test("SidebarIsShow", () => {
    renderWith(<Sidebar isOpen={true} />);
    render(<div className="sidebar"></div>);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});
