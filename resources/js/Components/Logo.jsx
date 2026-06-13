export default function Logo({ width = 100, height = 100, ...props }) {
    return (
        <img src="/images/logo.webp" width={width} height={height} {...props} />
    );
}
