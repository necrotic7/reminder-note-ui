import { Layout, Menu, Button, Dropdown, Modal, message, ConfigProvider, theme, Drawer, Grid } from 'antd';
import {
    HomeOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    BellOutlined,
    LogoutOutlined,
    MoonOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import liff from '@line/liff';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useEffect, useState } from 'react';
import { red } from '@ant-design/colors';
const { Header, Sider, Content, Footer } = Layout;

import { setToast } from "./Toast";
import { EnumLocalStorageKey } from '../../consts/localStorage';

function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    
    const [logoutModal, setLogoutModal] = useState(false);
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    // 初始化全域 Toast
    useEffect(() => {
        setToast(messageApi);
    }, [messageApi]);

    const menuItems: ItemType<MenuItemType>[] = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link to="/">首頁</Link>,
        },
        {
            key: '/createReminder',
            icon: <PlusOutlined />,
            label: <Link to="/createReminder">新增提醒</Link>,
        },
        {
            key: '/reminderList',
            icon: <UnorderedListOutlined />,
            label: <Link to="/reminderList">提醒清單</Link>,
        },
        {
            key: 'setting',
            icon: <SettingOutlined />,
            label: '設定',
        },
        {
            key: '/logout',
            icon: <LogoutOutlined />,
            label: '登出',
            style: { backgroundColor: red[8] }
        },
    ];

    const handleMenuClick = (info) => {
        if (info.key === '/logout') {
            setLogoutModal(true);
        }
        // 手機版點選菜單後關閉抽屜
        if (isMobile) {
            setDrawerVisible(false);
        }
    };

    // 側邊欄內容
    const sidebarContent = (
        <>
            <div
                style={{
                    height: 64,
                    margin: 16,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                }}
                
            >
                {collapsed ? '' : (<>你好，User<br/>id:{localStorage.getItem(EnumLocalStorageKey.LineID)}</>)}
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{
                    borderRight: 0,
                }}
            />
        </>
    );

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                {/* 桌面版側邊欄 */}
                {!isMobile && (
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(val) => setCollapsed(val)}
                        breakpoint="md"
                    >
                        {sidebarContent}
                    </Sider>
                )}

                {/* 手機版抽屜式側邊欄 */}
                { isMobile && (
                    <Drawer
                        title="選單"
                        placement="left"
                        closable={true}
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        styles={{body: {padding: 0}}}
                        width={280}
                    >
                        {sidebarContent}
                    </Drawer>
                )}

                <Layout
                    style={{
                        transition: 'margin-left 0.2s',
                    }}
                >
                    <Header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: isMobile ? '0 12px' : '0 16px',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: '100%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        {/* 手機版漢堡選單按鈕 */}
                        {isMobile && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerVisible(true)}
                                style={{
                                    marginRight: 16,
                                }}
                            />
                        )}

                        <h2
                            style={{
                                fontSize: isMobile ? '16px' : '20px',
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                margin: 0,
                            }}
                        >
                            Reminder
                        </h2>

                        <div
                            style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                gap: isMobile ? 4 : 8,
                                alignItems: 'center',
                            }}
                        >
                            <Button 
                                onClick={() => setDarkTheme(!darkTheme)} 
                                icon={<MoonOutlined />}
                                type={isMobile ? 'text' : 'default'}
                                size={isMobile ? 'small' : 'middle'}
                            />
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: '1', label: '你有新的提醒事項' },
                                        { key: '2', label: '更多通知...' },
                                    ],
                                }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button
                                    shape="circle"
                                    icon={<BellOutlined />}
                                    type={isMobile ? 'text' : 'default'}
                                    size={isMobile ? 'small' : 'middle'}
                                />
                            </Dropdown>
                        </div>
                    </Header>

                    {/* 主內容 */}
                    <Content
                        style={{
                            overflow: 'initial',
                        }}
                    >
                        {contextHolder}
                        <div
                            style={{
                                padding: isMobile ? 16 : 24,
                                minHeight: 360,
                                borderRadius: 8,
                            }}
                        >
                            <Outlet />
                        </div>
                    </Content>

                    {/* Footer */}
                    <Footer
                        style={{
                            textAlign: 'center',
                            fontSize: isMobile ? '12px' : '14px',
                            padding: isMobile ? '12px 0' : '24px 0',
                        }}
                    >
                        Reminder App ©2025 讓生活更有條理
                    </Footer>
                </Layout>

                {/* 登出確認 Modal */}
                <Modal
                    title="確認要登出嗎？"
                    open={logoutModal}
                    onOk={() => {
                        setLogoutModal(false);
                        liff.logout();
                        navigate("/login");
                        message.success("已登出");
                    }}
                    onCancel={() => setLogoutModal(false)}
                    centered={isMobile}
                    width={isMobile ? '90%' : 416}
                >
                    <p>登出後需要重新登入才能使用應用程式。</p>
                </Modal>
            </Layout>
        </ConfigProvider>
    );
}

export default MainLayout;