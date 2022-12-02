import * as ReactDOM from "react-dom";

/** These must match elements' ids in client/assets/index.html */
export enum PortalIds {
  BottomDrawer = "bottom-drawer",
  Toast = "toast",
  WelcomeBanner = "welcome-banner",
}

const getRoot = (id: PortalIds) => {
  const root = document.getElementById(id);
  if (!root) {
    console.error(`id [${id}] not found in DOM`);
  }
  return root;
};

type PortalProps = {
  id: PortalIds;
  children: React.ReactNode;
};

export const Portal = ({ id, children }: PortalProps) => {
  const rootNodes = {
    [PortalIds.BottomDrawer]: getRoot(PortalIds.BottomDrawer),
    [PortalIds.Toast]: getRoot(PortalIds.Toast),
    [PortalIds.WelcomeBanner]: getRoot(PortalIds.WelcomeBanner),
  };
  const rootNode = rootNodes[id];
  return rootNode && ReactDOM.createPortal(children, rootNode);
};
