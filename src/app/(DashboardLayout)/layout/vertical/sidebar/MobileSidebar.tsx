"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import FullLogo from "../../shared/logo/FullLogo";
import { Icon } from "@iconify/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define the UserRole type
type UserRole = "USER" | "TELECONSULTER" | "HEALTHCARE_FACILITY" | "PHARMACY" | "ADMIN";

// Define the types for MenuItem and ChildItem
export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

const MobileSidebar = () => {
  const [userRole, setUserRole] = useState<UserRole | "USER">("USER");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.success && data.user && data.user.role) {
          setUserRole(data.user.role as UserRole);
        } else {
          setUserRole("USER"); // Fallback to "USER" if role is not defined
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole("USER"); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="block">
        <div className="flex">
          <Sidebar className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10]" aria-label="Sidebar with multi-level dropdown example">
            <div className="mb-7 px-6 brand-logo">
              <Skeleton height={40} width={200} />
            </div>
            <SimpleBar className="h-[calc(100vh_-_120px)]">
              <Sidebar.Items className="px-6">
                <Sidebar.ItemGroup className="sidebar-nav">
                  {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                      <h5 className="text-link text-xs caption">
                        <Skeleton width={100} />
                      </h5>
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                        height={18}
                      />
                      <div className="collpase-items">
                        <Skeleton height={30} count={3} />
                      </div>
                    </React.Fragment>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>
          </Sidebar>
        </div>
      </div>
    );
  }

  // Access the menu based on the user's role
  const roleBasedSidebarContent = SidebarContent[userRole as UserRole] || SidebarContent["USER"];

  return (
    <div className="block">
      <div className="flex">
        <Sidebar className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10]" aria-label="Sidebar with multi-level dropdown example">
          <div className="mb-7 px-6 brand-logo">
            <FullLogo />
          </div>

          <SimpleBar className="h-[calc(100vh_-_120px)]">
            <Sidebar.Items className="px-6">
              <Sidebar.ItemGroup className="sidebar-nav">
                {roleBasedSidebarContent.map((item: MenuItem, index: number) => (
                  <React.Fragment key={index}>
                    <h5 className="text-link text-xs caption">
                      <span className="hide-menu">{item.heading}</span>
                    </h5>
                    <Icon
                      icon="solar:menu-dots-bold"
                      className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                      height={18}
                    />
                    {item.children?.map((child: ChildItem) => (
                      <React.Fragment key={child.id}>
                        {child.children ? (
                          <div className="collpase-items">
                            <NavCollapse item={child} />
                          </div>
                        ) : (
                          <NavItems item={child} />
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </div>
  );
};

export default MobileSidebar;