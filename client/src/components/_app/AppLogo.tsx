import { Link } from "react-router-dom";

interface Props {
  abbr: string;
  firstLine: string;
  secondLine: string;
}

export default ({ abbr, firstLine, secondLine }: Props) => (
  <Link to="/" className="flex flex-row items-center">
    <strong className="text-[2rem]">{abbr}</strong>
    <span className="inline-block ml-1 text-[0.9rem] leading-[0.9rem] ">
      {firstLine} <br /> {secondLine}
    </span>
  </Link>
);
