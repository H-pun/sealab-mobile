import React, { useState, } from 'react';

import {
    Divider,
    TextInput,
    Menu,
    useTheme
} from 'react-native-paper';

import {
    ScrollView,
    Keyboard,
    StyleProp,
    ViewStyle,
    View,
} from 'react-native';

type DropDownProps = {
    value: string;
    onValueChange: (value: string) => void;
    label: string;
    list: [{
        title: string,
        value: string,
    }],
    loading: boolean,
    offset?: number,
    style: StyleProp<ViewStyle>
    contentStyle: StyleProp<ViewStyle>
    inputStyle: StyleProp<ViewStyle>
};

const DropDown = (props: DropDownProps) => {
    const { colors } = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);
    const [label, setLabel] = useState(props.list[0].title);
    return (
        <Menu
            style={[props.style, { marginTop: -(props.offset ?? 0) }]}
            contentStyle={{ backgroundColor: colors.background }}
            visible={menuVisible}
            onDismiss={() => { setMenuVisible(false) }}
            anchorPosition='bottom'
            anchor={
                <TextInput
                    style={props.inputStyle}
                    value={label}
                    label={props.label}
                    disabled={props.loading}
                    showSoftInputOnFocus={false}
                    caretHidden={true}
                    mode='outlined'
                    onTouchStart={() => {
                        setMenuVisible(true);
                        if (Keyboard.isVisible()) Keyboard.dismiss()
                    }}
                    right={
                        <TextInput.Icon
                            animated
                            onPress={() => setMenuVisible(true)}
                            icon={menuVisible ? 'chevron-up' : 'chevron-down'}
                        />}
                />
            }>
            <ScrollView style={props.contentStyle}>
                {props.list.map((item, index) => (
                    <View key={index}>
                        <Menu.Item
                            title={item.title}
                            style={{ maxWidth: '100%' }}
                            onPress={() => {
                                setMenuVisible(false)
                                setLabel(item.title)
                                props.onValueChange(item.value.toString())
                            }}
                        />
                        <Divider />
                    </View>
                ))}
            </ScrollView>
        </Menu>
    )
};

export default DropDown;
