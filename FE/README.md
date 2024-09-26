# 🌟 FE

![React](https://img.shields.io/badge/React-%23282c34?logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-%23263626?logo=vite&logoColor=FFD700)

[Main README](../README.md)

## 🌟 Getting started

Use the following command to install dependencies

![CLI](https://img.shields.io/badge/CLI-000000?logo=gnometerminal&logoColor=4AF626&style=for-the-badge)

```
npm install
```

Use the following command to start developing

![CLI](https://img.shields.io/badge/CLI-000000?logo=gnometerminal&logoColor=4AF626&style=for-the-badge)

```
npm run dev
```

Now you should see that VITE is running at http://localhost:5173/
At this url you will be able to see your changes on save!

## Some notes

### 🌟 Theming

Where is the theme?

![Path](https://img.shields.io/badge/Path-%23000000?logo=files&logoColor=white&style=for-the-badge)

```
/src/Theme
```

This folder contains the type definition, color palette and the themes themselves.
This will allow us to have a unified styling accross the application easily.

How do I use this theme?
There are examples of destructuring the theme and using it in your styles with styled-components in:

![Path](https://img.shields.io/badge/Path-%23000000?logo=files&logoColor=white&style=for-the-badge)

```
src/BaseStyledComponents/BaseStyled.ts
```

This file contains some basic Base Styled Components. These should be used as the base of our styling when creating html tags.
For instance:

![Style](https://img.shields.io/badge/Style-%23000000?logo=styledcomponents&logoColor=ff00ff&style=for-the-badge)

```ts
export const StyledBaseDiv = styled.div`
    ${({ theme }) => css`
        background: ${theme.colors.background};
        color: ${theme.colors.text};
    `}
`;
```

Let's say we want to style a div for some portion of our app.

![Style](https://img.shields.io/badge/Style-%23000000?logo=styledcomponents&logoColor=ff00ff&style=for-the-badge)

```ts
export const ExampleDiv = styled(StyledBaseDiv)``;
```

This will give the ExampleDiv a background and color from StyledBaseDiv as defined within it.
You can override these styles by simply adding them into this component like so.

![Style](https://img.shields.io/badge/Style-%23000000?logo=styledcomponents&logoColor=ff00ff&style=for-the-badge)

```ts
export const ExampleDiv = styled(StyledBaseDiv)`
    color: #000;
    ${({ theme }) => css`
        background: #fff;
    `}
`;
```

The color and background will now be black and white respectively. However if we want to stick with a theme, in most cases the base styles should not be modified.

### 🌟 Using Styled Components

![Component](https://img.shields.io/badge/Component-000000?logo=htmx&logoColor=dfc741&style=for-the-badge)

```tsx
import {ExampleDiv} from 'someImportLocation';

const DefaultProps {
    someOptionalProp: 'Default Optional Prop'
}

interface MyProps {
    someOptionalProp?:string;
}
// setting someOptionalProp to the default prop means if the prop does not exist, it's value will be that of the default props
const MyExpampleComponent = ({someOptionalProp=DefaultProps.someOptionalProp}:MyProps) => {
    const [someState, setSomeState] = useState('state');
    return (
        <ExampleDiv>
            <ExampleDiv>{someState}</ExampleDiv>
            <ExampleDiv>{someOptionalProp}</ExampleDiv>
        </ExampleDiv>
    );
};
```
