<?php

namespace App\Services;

use DOMDocument;
use DOMElement;
use DOMNode;

class StoryHtmlSanitizer
{
    public function sanitize(string $html): string
    {
        $document = new DOMDocument;
        $previous = libxml_use_internal_errors(true);
        try {
            $document->loadHTML('<?xml encoding="UTF-8"><html><body>'.$html.'</body></html>', LIBXML_NONET);
            $body = $document->getElementsByTagName('body')->item(0);
            $this->clean($body);

            return implode('', array_map(fn (DOMNode $child): string => $document->saveHTML($child), iterator_to_array($body->childNodes)));
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }
    }

    private function clean(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $child) {
            if (! $child instanceof DOMElement) {
                if ($child->nodeType !== XML_TEXT_NODE) {
                    $parent->removeChild($child);
                }

                continue;
            }
            $tag = strtolower($child->tagName);
            if (in_array($tag, ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'template'], true)) {
                $parent->removeChild($child);

                continue;
            }
            $href = $tag === 'a' ? trim($child->getAttribute('href')) : '';
            foreach (iterator_to_array($child->attributes) as $attribute) {
                $child->removeAttribute($attribute->name);
            }
            if ($href !== '' && preg_match('~^(https?://|mailto:|tel:|/(?!/)|#)~i', $href) && ! preg_match('/[\x00-\x20\x7f]/', $href)) {
                $child->setAttribute('href', $href);
            }
            $this->clean($child);
            if (! in_array($tag, ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 's', 'mark', 'ul', 'ol', 'li', 'blockquote', 'a', 'br', 'hr', 'pre', 'code'], true)) {
                while ($child->firstChild) {
                    $parent->insertBefore($child->firstChild, $child);
                }
                $parent->removeChild($child);
            }
        }
    }
}
