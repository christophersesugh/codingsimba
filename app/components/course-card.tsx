import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardBadge } from "./card-badge";
import { Link } from "react-router";

interface CourseCardProps {
  course: {
    title: string;
    description: string;
    image: string;
    level: string;
    lessons: number;
    duration: string;
    price: string;
    tag?: string;
  };
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full w-full"
    >
      <Card className="flex h-full w-full flex-col overflow-hidden pt-0 transition-shadow duration-300 hover:shadow-md">
        <div className="relative w-full flex-shrink-0">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={"https://placehold.co/400"}
              alt={course.title}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {course.tag ? <CardBadge>{course.tag}</CardBadge> : null}
        </div>

        <div className="flex w-full flex-1 flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {course.level}
              </Badge>
              <span className="text-lg font-bold">{course.price}</span>
            </div>
          </CardHeader>

          <CardContent className="mb-4 flex-1">
            <CardTitle className="group-hover:text-primary mb-2 line-clamp-2 transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {course.description}
            </CardDescription>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-4">
            <div className="text-muted-foreground flex w-full items-center justify-between text-sm">
              <div className="flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to={"/"}>Enroll Now</Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
